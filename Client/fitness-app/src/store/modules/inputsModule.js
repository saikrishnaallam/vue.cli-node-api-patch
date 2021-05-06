const state = {
    inputs: [

    ],
    inputTypes: {
        'FoodInput': {
            icon: 'fas fa-hamburger',
            sufix: 'calories added',
            name: 'Food input'
        },
        'ExerciseInput': {
            icon: 'fas fa-dumbbell',
            sufix: 'calories burned',
            name: 'Exercise input'
        }
    },

    exerciseTypes: [],
    foodTypes:["Vegan","Meat","Dairy","Mix"]
}

const getters = {
    getInputTypes: state => state.inputTypes,
    getInputs: state => state.inputs,
    getFoodTypes: state =>state.foodTypes
}

const actions = {
 
}

const mutations = {

}

export default {
    state, getters, actions, mutations
}