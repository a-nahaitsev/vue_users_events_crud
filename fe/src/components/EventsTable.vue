<script>
import axios from 'axios';
import Modal from './EventModal.vue';
import EditingModal from './EventEditingModal.vue';

export default {
  props: ['userId'],

  components: {
    Modal,
    EditingModal,
  },

  data() {
    return {
      allUserEvents: [],
      events: [],
      eventToUpdate: {},

      newEvent: {
        title: '',
        description: '',
        startDate: this.formatDate(),
        endDate: this.formatDate(),
      },

      renderKey: 0,
      showModal: false,
      showEditingModal: false,
      page: 1,
      pages: 0,
      sortBy: 'title',
      sortOrder: 1,
      message: '',
    }
  },

  mounted() {
    this.loadEvents();
  },

  methods: {
    loadEvents() {
      axios
        .get(`http://localhost:5000/events/${this.userId}?page=${this.page}&sortBy=${this.sortBy}&sortOrder=${this.sortOrder}`)
        .then((response) => {
            this.events = response.data.events;
            this.pages = Math.ceil(response.data.count / 5);
            this.allUserEvents = response.data.allUserEvents;
        })
        .then(() => {
          this.renderKey++;
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    onGetOne(eventId) {
      axios
        .get(`http://localhost:5000/events/${this.userId}/${eventId}`)
        .then((response) => {
            this.eventToUpdate = response.data;
            const startDate = this.formatDate(this.eventToUpdate.startDate);
            const endDate = this.formatDate(this.eventToUpdate.endDate);
            this.eventToUpdate = { 
              ...this.eventToUpdate,
              startDate,
              endDate
            };
        })
        .catch((errors) => {
            console.log(errors);
        });
      
      this.showEditingModal = true;
    },

    areDatesIncorrect(event, action, eventId) {
      if (event.endDate < event.startDate) {
        this.message = 'End date must be later than Start date or equal to';

        return true;
      }

      let eventsToCheck;

      if (action === 'update') {
        eventsToCheck = [ ...this.allUserEvents.filter(e => e['_id'] !== eventId), event ]
      } else {
        eventsToCheck = [ ...this.allUserEvents, event ];
      }
      console.log(eventsToCheck);

      const sortedEvents = eventsToCheck.sort((eventA, eventB) => {
        return eventA.startDate.toString().slice(0, 10)
          .localeCompare(eventB.startDate.toString().slice(0, 10));
      });
      
      for (let i = 0; i < sortedEvents.length - 1; i++) {
        const formattedPrevEventEndDate = sortedEvents[i].endDate.toString().slice(0, 10);
        const formattedNextEventStartDate = sortedEvents[i + 1].startDate.toString().slice(0, 10);

        console.log(formattedPrevEventEndDate, formattedNextEventStartDate);
        
        if (formattedPrevEventEndDate >= formattedNextEventStartDate) {
          this.message = 'You can\’t create event for this time';

          return true;
        }
      }
    },

    onAdd() {
      if (this.areDatesIncorrect(this.newEvent)) {
        return;
      };

      axios
        .post(`http://localhost:5000/events/${this.userId}`, { ...this.newEvent, userId: this.userId })
        .then(() => {
          this.loadEvents();
          this.newEvent = {
            title: '',
            description: '',
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
          };
          this.showModal = false;
          this.message = '';
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    onDelete(eventId) {
      axios
        .delete(`http://localhost:5000/events/${this.userId}/${eventId}`)
        .then(() => {
          this.loadEvents();
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    onUpdate(eventId) {
      if (this.areDatesIncorrect(
        this.eventToUpdate,
        'update',
        eventId
      )) {
        return;
      };

      axios
        .patch(`http://localhost:5000/events/${this.userId}/${eventId}`, { ...this.eventToUpdate })
        .then(() => {
          this.loadEvents();
          this.renderKey++;
          this.showEditingModal = false;
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    formatDate(date = Date.now()) {
      return new Date(date).toISOString().slice(0, 10);
    },

    changePage(pageNumber) {
      this.page = pageNumber;
      this.loadEvents();
    },

    changeSort(event) {
      this.sortBy = event.target.id;

      if (this.sortOrder === 1) {
        this.sortOrder = -1;
      } else {
        this.sortOrder = 1;
      }

      this.loadEvents();
    },

    closeAddingModal() {
      this.showModal = false;
      this.newEvent = {
        title: '',
        description: '',
        startDate: this.formatDate(),
        endDate: this.formatDate(),
      };
      this.message = '';
    },

    closeEditingModal() {
      this.showEditingModal = false;
      this.message = '';
    }
  }
}
</script>

<template>
  <div>
    <router-link :to="'/users'" class="btn btn-secondary btn-back">
      Back to main page
    </router-link>

    <button
      type="button" 
      class="btn btn-outline-primary btn-create" 
      id="show-modal" 
      @click="showModal = true"
    >
      Create event
    </button>

    <Teleport to="body">
      <Modal 
        :message="message"
        :show="showModal" 
        :event="newEvent"
        @close="onAdd"
        @closeWithoutAdding="closeAddingModal"
      />
    </Teleport>

    <Teleport to="body">
      <EditingModal
        :message="message"
        :show="showEditingModal" 
        :event="eventToUpdate"
        @close="onUpdate"
        @closeWithoutAdding="closeEditingModal"
      />
    </Teleport>

    <table class="table table-hover shadow-lg p-3 mb-5 bg-white rounded">
      <thead>
        <tr>
          <th scope="col">
            Title
            <button
              :class="{'btn-sort--active': sortBy === 'title'}"
              class="btn-sort"
              id="title"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            Description
            <button
              :class="{'btn-sort--active': sortBy === 'description'}"
              class="btn-sort"
              id="description"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            Start Date
            <button
              :class="{'btn-sort--active': sortBy === 'startDate'}"
              class="btn-sort"
              id="startDate"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            End Date
            <button 
              :class="{'btn-sort--active': sortBy === 'endDate'}"
              class="btn-sort"
              id="endDate"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">Edit/Delete</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="event of events" :key="event['_id']">
          <td>{{event.title}}</td>
          <td>{{event.description}}</td>
          <td>{{formatDate(event.startDate)}}</td>
          <td>{{formatDate(event.endDate)}}</td>
          <td>
            <button 
              type="button"
              class="close btn-table"
              aria-label="Close"
              @click="onDelete(event['_id'])"
            >
              <span aria-hidden="true">
                &times;
              </span>
            </button>

            <button 
              type="button"
              class="close btn-table"
              aria-label="Close"
              @click="onGetOne(event['_id'])"
            >
              <span aria-hidden="true">
                &hellip;
              </span>
            </button>
          </td>
        </tr>

        <tr v-show="!events.length">
          <td colspan="5">No scheduled events</td>
        </tr>
      </tbody>
    </table>

    <ul class="pagination pagination-custom">
      <li 
        v-for="n of pages" 
        :key="n"
        class="page-item"
        :class="{active: n === page}"
      >
        <a class="page-link" @click="changePage(n)">
            {{n}}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .btn-back {
    margin: 0 20px 20px 0;
  }

  .btn-create {
    margin-bottom: 20px;
  }

  .btn-sort {
    border-width: 0px;
    background-color: #fff;
    outline: none;
  }

  .btn-sort:hover {
    color: #007bff;
  }

  .btn-sort--active {
    color: #007bff;
  }

  .pagination-custom {
    display: flex;
    justify-content: center;
  }

  .btn-table {
    margin-right: 30px;
  }
</style>
