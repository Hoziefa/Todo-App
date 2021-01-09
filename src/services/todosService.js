import firebase, { firebaseLooper } from "../services/firebase";
import userService from "./userService";

class TodosService {
    todosRef = firebase.database().ref("users");

    async createTodo(todo) {
        await this.todosRef.child(userService.currentUser.uid).push(todo);
    }

    async updateTodo(newTodo) {
        await this.todosRef.child(userService.currentUser.uid).update(newTodo);
    }

    async deleteTodo(todoId) {
        await this.todosRef.child(userService.currentUser.uid).child(todoId).remove();
    }

    async getTodos() {
        return await this.todosRef
            .child(userService.currentUser.uid)
            .once("value")
            .then(snaps => firebaseLooper(snaps.toJSON()));
    }

    get getTimestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
    }
}

const todosService = new TodosService();

export default todosService;
