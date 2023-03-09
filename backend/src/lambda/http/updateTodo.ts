import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/toDos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UpdateToDoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    //Activity  Log ::  Updating Todo Item
    logger.info('Update Todo Handler :: ', 'Attempt Updating Todo Item')
    const userId = getUserId(event)
    await updateTodo(userId, todoId, updatedTodo)

    return { statusCode: 204, body: '' }
  }

  // return undefined
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
