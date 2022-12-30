<script>
import axios from 'axios';
import Modal from './UserModal.vue';
import EditingModal from './UserEditingModal.vue';

export default {
  components: {
    Modal,
    EditingModal,
  },

  data() {
    return {
      users: [],
      userToUpdate: {},

      newUser: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      },

      renderKey: 0,
      showModal: false,
      showEditingModal: false,
      page: 1,
      pages: 0,
      sortBy: 'firstName',
      sortOrder: 1,
    }
  },

  mounted() {
    this.loadUsers();
  },

  methods: {
    loadUsers() {
      axios
        .get(`http://localhost:5000/users?page=${this.page}&sortBy=${this.sortBy}&sortOrder=${this.sortOrder}`)
        .then((response) => {
            this.users = response.data.users;
            this.pages = Math.ceil(response.data.count / 5);
        })
        .then(() => {
          this.renderKey++;
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    onGetOne(userId) {
      axios
        .get(`http://localhost:5000/users/${userId}`)
        .then((response) => {
            this.userToUpdate = response.data;
        })
        .catch((errors) => {
            console.log(errors);
        });

      this.showEditingModal = true;
    },

    onAdd() {
      axios
        .post(`http://localhost:5000/users`, this.newUser)
        .then(() => {
          this.loadUsers();
        })
        .catch((errors) => {
            console.log(errors);
        });
      
      this.newUser = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      };

      this.showModal = false;
    },

    onDelete(userId) {
      axios
        .delete(`http://localhost:5000/users/${userId}`)
        .then(() => {
          this.loadUsers();
        })
        .catch((errors) => {
            console.log(errors);
        });
    },

    onUpdate(userId) {
      axios
        .patch(`http://localhost:5000/users/${userId}`, { ...this.userToUpdate })
        .then(() => {
          this.loadUsers();
          this.renderKey++;
        })
        .catch((errors) => {
            console.log(errors);
        });

      this.showEditingModal = false;
    },

    formatDate(date = Date.now()) {
      return new Date(date).toISOString().slice(0, 10);
    },

    changePage(pageNumber) {
      this.page = pageNumber;
      this.loadUsers();
    },

    changeSort(event) {
      this.sortBy = event.target.id;

      if (this.sortOrder === 1) {
        this.sortOrder = -1;
      } else {
        this.sortOrder = 1;
      }

      this.loadUsers();
    },

    closeAddingModal() {
      this.showModal = false;
      this.newUser = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
      };
    },

    closeEditingModal() {
      this.showEditingModal = false;
    },
  }
}
</script>

<template>
  <div>
    <button 
      type="button" 
      class="btn btn-outline-primary btn-create" 
      id="show-modal" 
      @click="showModal = true"
    >
      Create user
    </button>

    <Teleport to="body">
      <Modal 
        :show="showModal" 
        :user="newUser"
        @close="onAdd"
        @closeWithoutAdding="closeAddingModal"
      />
    </Teleport>

    <Teleport to="body">
      <EditingModal 
        :show="showEditingModal" 
        :user="userToUpdate"
        @close="onUpdate"
        @closeWithoutAdding="closeEditingModal"
      />
    </Teleport>

    <table class="table table-hover shadow-lg p-3 mb-5 bg-white rounded">
      <thead>
        <tr>
          <th scope="col">
            <span>UserName</span>
            <button
              :class="{'btn-sort--active': sortBy === 'firstName'}" 
              class="btn-sort"
              id="firstName"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            Email
            <button
              :class="{'btn-sort--active': sortBy === 'email'}"
              class="btn-sort"
              id="email"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            PhoneNumber
            <button 
              :class="{'btn-sort--active': sortBy === 'phoneNumber'}"
              class="btn-sort"
              id="phoneNumber"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            Events Count
            <button 
              :class="{'btn-sort--active': sortBy === 'eventsCount'}" 
              class="btn-sort"
              id="eventsCount"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th scope="col">
            Next Event Date
            <button 
              :class="{'btn-sort--active': sortBy === 'nextEventDate'}"
              class="btn-sort"
              id="nextEventDate"
              @click="changeSort"
            >
              &udarr;
            </button>
          </th>

          <th>Edit/Delete</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user of users" :key="user['_id']">
          <td>
            <router-link :to="'/events/' + user['_id']">
              {{user.firstName}} {{user.lastName}}
            </router-link>
          </td>
          <td>{{user.email}}</td>
          <td>{{user.phoneNumber}}</td>
          <td>{{user.eventsCount}}</td>
          <td>
            {{formatDate(user.nextEventDate) === '1000-01-01'
              ? 'Not planned' 
              : formatDate(user.nextEventDate)
            }}
          </td>
          <td>
            <button 
              type="button"
              class="close btn-table"
              aria-label="Close"
              @click="onDelete(user['_id'])"
            >
              <span aria-hidden="true">
                &times;
              </span>
            </button>

            <button 
              type="button"
              class="close btn-table"
              aria-label="Close"
              @click="onGetOne(user['_id'])"
            >
              <span aria-hidden="true">
                &hellip;
              </span>
            </button>
          </td>
        </tr>
        <tr v-show="!users.length">
          <td colspan="5">No users</td>
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
        <a 
          class="page-link" 
          @click="changePage(n)"
        >
          {{n}}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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