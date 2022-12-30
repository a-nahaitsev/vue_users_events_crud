<script>
export default {
  props: [
    'show', 
    'user',
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
            <h5 class="modal-title">Edit user</h5>
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
            <form class="modal-form" @submit.prevent="$emit('close', user['_id'])">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  class="form-control"
                  type="text" 
                  id="firstName" 
                  placeholder="Your first name" 
                  v-model="user.firstName" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  class="form-control"
                  type="text" 
                  id="lastName" 
                  placeholder="Your last name" 
                  v-model="user.lastName" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  class="form-control"
                  type="email" 
                  id="email" 
                  placeholder="Your e-mail" 
                  v-model="user.email" 
                  required
                >
              </div>

              <div class="form-group">
                <label for="phoneNumber">Phone Number</label>
                <input  
                  class="form-control"
                  type="text" 
                  id="phoneNumber" 
                  placeholder="Your phone number" 
                  v-model="user.phoneNumber" 
                  required
                >
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

<style>
.modal-active {
  display: block;
}

.btn-center {
  display: block;
  margin: 0 auto;
}
</style>