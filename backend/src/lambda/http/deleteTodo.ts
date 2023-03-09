import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/toDos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('DeleteToDoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    //Activity  Log ::  Deleting Todo Item
    logger.info('Delete Todo Handler :: ', 'Attempt Deleting Todo Item')
    const userId = getUserId(event)
    await deleteTodo(userId, todoId)

    return { statusCode: 204, body: '' }

    // return undefined
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
