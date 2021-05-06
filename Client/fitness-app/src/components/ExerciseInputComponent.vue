<template>
  <div class="container">
    <div class="field">
      <label for class="label">Describe exercise:</label>
      <div class="control">
        <input type="text" class="input" v-model.trim="input.description" />
        <p v-if="!$v.input.description.required" class="help is-danger">
          Required
        </p>
      </div>
    </div>
    <b-field label="Type of exercise" class="w-100">
      <b-autocomplete
        v-model="exerciseTypeInput"
        :data="getFilteredExerciseTypes || input.type"
        placeholder="What exercise did you do?"
        @select="selectedExerciseType"
        :open-on-focus="true"
      />
    </b-field>
    <div class="field">
      <label for class="label">For how long:</label>
    </div>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          type="text"
          class="input"
          v-model.trim="input.length"
          placeholder="For how long"
        />
        <p v-if="!$v.input.length.required" class="help is-danger">
          Needs to be a numeric
        </p>
      </div>
      <div class="control">
        <span class="select">
          <select v-model="input.timeUnit">
            <option value="Hours">Hours</option>
            <option value="Minutes">Minutes</option>
            <option value="Seconds">Seconds</option>
          </select>
        </span>
      </div>
    </div>
    <div class="field">
      <label for class="label">Calories burnt:</label>
      <div class="control">
        <input
          type="text"
          class="input"
          v-model.number="input.numberOfCaloriesBurned"
        />
        <p
          v-if="!$v.input.numberOfCaloriesBurned.required"
          class="help is-danger"
        >
          Required
        </p>
      
      </div>
    </div>
    <div class="field is-grouped is-grouped-right">
      <label class="checkbox">
        <input type="checkbox" v-model="input.public" />
        Share this accomplishment
      </label>
    </div>
    <div class="field is-grouped is-grouped-centered">
      <div class="control">
        <button
          :disabled="$v.input.$invalid"
          class="button is-link"
          @click="addButtonClick()"
        >
          Add to your daily exercise
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";
export default {
  name: "ExerciseInputComponent",

  computed: {
    ...mapGetters(["getPostVisibility", "getExerciseTypes"]),
    getFilteredExerciseTypes() {
      return ["Cardio", "HIT", "Strength", "Meditation", "Custom"];
    },
  },
  data() {
    return {
      //exerciseTypeInput is used to store text we type in autocomplete
      exerciseTypeInput: "",

      input: {
        type: "",
        description: "",
        public: false,
        numberOfCaloriesBurned: null,
        length: null,
        timeUnit: "Seconds",
      },
    };
  },
  validations: {
    input: {
      type: {
        required,
      },
      description: {
        required,
      },
      numberOfCaloriesBurned: {
        required,
      },
      timeUnit: {
        required,
      },
      length: {
        required,
      },
    },
  },
  methods: {
    ...mapActions(["addInput", "fetchExerciseTypes", "addNewExercisePost"]),
    selectedExerciseType(selectedType) {
      this.input.type = selectedType;
    },
    async addButtonClick() {
      if (!this.$v.input.$invalid) {
        console.warn(this.input);
        this.addNewExercisePost(this.input);
         this.clearForm()
      }
    },
    clearForm() {
      this.input.type = "";
      this.input.description = "";
      this.input.numberOfCaloriesBurned = null;
      this.input.timeUnit = "";
      this.input.length = 0;
    },
  },
};
</script>

<style>
.w-100 {
  width: 100%;
}
</style>