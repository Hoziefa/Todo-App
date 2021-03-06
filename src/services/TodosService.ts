import { apiService } from './ApiService';
import { userServices } from './UserServices';
import { ITodo } from 'types';

class TodosService {
    private static instance: TodosService;

    private readonly todosRef = apiService.databaseRef('todos');

    private constructor() {}

    public static get todosService(): TodosService {
        !TodosService.instance && (TodosService.instance = new TodosService());

        return TodosService.instance;
    }

    public get getTimestamp(): object {
        return apiService.getTimestamp;
    }

    public async createTodo(todo: ITodo): Promise<ITodo> {
        const newTodo = await this.todosRef.child(userServices.auth.currentUser.uid).push(todo);

        return newTodo.get().then((snap): ITodo => ({ id: snap.key, ...snap.val() }));
    }

    public async updateTodo({ id, ...newTodo }: ITodo): Promise<void> {
        await this.todosRef.child(userServices.auth.currentUser.uid).child(id!).update(newTodo);
    }

    public async deleteTodo(todoId: string): Promise<void> {
        await this.todosRef.child(userServices.auth.currentUser.uid).child(todoId).remove();
    }

    public async getTodos(): Promise<Array<ITodo>> {
        return await this.todosRef.child(userServices.auth.currentUser.uid).once('value').then((snaps): Array<ITodo> => apiService.firebaseLooper(snaps.toJSON()!));
    }
}

export const { todosService } = TodosService;
