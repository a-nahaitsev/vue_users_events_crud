<script>
export default {
  props: [
    'show', 
    'event',
    'message',
  ],
}
</script>

<template>
  <Transition name="modal">
    <div 
      :class="{'modal-active': show}"
      class="modal modal-custom"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new event</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="$emit('closeWithoutAdding')"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="modal-form" @submit.prevent="$emit('close')">
              <div class="form-group">
                <label for="title">Title</label>
                <input 
                  class="form-control"
                  type="text" 
                  id="title" 
                  placeholder="Your title" 
                  v-model="event.title" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <input 
                  class="form-control"
                  type="text" 
                  id="description" 
                  placeholder="Your description" 
                  v-model="event.description" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="startDate">Start date</label>
                <input 
                  class="form-control"
                  type="date" 
                  id="startDate" 
                  placeholder="Your start date" 
                  v-model="event.startDate" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="endDate">End date</label>
                <input  
                  class="form-control"
                  type="date" 
                  id="endDate" 
                  placeholder="Your end date" 
                  v-model="event.endDate" 
                  required
                >
              </div>
              
              <div class="form-group form-group-text">
                {{message}}
              </div>
              <input 
                type="submit"
                class="btn btn-primary btn-center"
                value="Save"
              >
            </form>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-active {
  display: block;
}

.form-group-text {
  color: #dc3545;
}

.btn-center {
  display: block;
  margin: 0 auto;
}
</style>
