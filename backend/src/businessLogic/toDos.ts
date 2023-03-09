import { ToDoAccess } from '../dataLayer/toDosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('ToDoBusinessLogic')
const attachmentUtils = new AttachmentUtils()
const toDoAccess = new ToDoAccess()

// Create ToDo
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  //Activity  Log ::  Creating Todo Item
  logger.info('Create Todo BusinessLogic :: ', 'Creating Todo Item')

  const todoId = uuid.v4()

  const newTodoItem = {
    userId,
    todoId,
    attachmentUrl: attachmentUtils.getAttachmentUrl(todoId),
    createdAt: new Date().getTime().toString(),
    done: false,
    ...newTodo
  }

  return await toDoAccess.createToDo(newTodoItem)
}

// Get ToDos
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  //Activity  Log ::  Fetching Todo Items
  logger.info('Fetch Todo BusinessLogic :: ', 'Fetching Todo Items')
  return toDoAccess.getAllToDo(userId)
}

// Delete ToDos
export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<string> {
  //Activity  Log ::  Deleting Todo Item
  logger.info('Delete Todo BusinessLogic :: ', 'Deleting Todo Item')
  return toDoAccess.deleteToDo(todoId, userId)
}

// Update ToDos
export async function updateTodo(
  userId: string,
  todoId: string,
  todoUpdate: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
  //Activity  Log ::  Updating Todo Item
  logger.info('Update Todo BusinessLogic :: ', 'Updating Todo Item')
  return toDoAccess.updateToDo(todoUpdate, todoId, userId)
}

// create AttachmentPresignedUrl
export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  //Activity  Log ::  Creating Attachment Presigned Url for Todo Item
  logger.info(
    'Create Attachment Presigned Url BusinessLogic :: ',
    'Creating Attachment Presigned Url for Todo Item'
  )
  logger.info('Create Attachment', userId)
  return attachmentUtils.getUploadUrl(todoId)
}
