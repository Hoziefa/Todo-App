import firebase, { firebaseLooper } from "../services/firebaseService";
import userService from "./userService";

class TodosService {
    todosRef = firebase.database().ref("todos");

    async createTodo(todo) {
        const newTodo = await this.todosRef.child(userService.currentUser.uid).push(todo);

        return newTodo.get().then(snap => ({ id: snap.key, ...snap.val() }));
    }

    async updateTodo({ id, ...newTodo }) {
        await this.todosRef.child(userService.currentUser.uid).child(id).update(newTodo);
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
