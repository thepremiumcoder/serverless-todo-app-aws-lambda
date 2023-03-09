import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/toDos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('GetToDoHandler')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here

    //Activity  Log ::  Fetching Todo Items
    logger.info('Fetch Todo Items Handler :: ', 'Attempt Fetching Todo Items')

    const userId = await getUserId(event)
    const todos = await getTodosForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({ items: todos })
    }
  }
  // return undefined
)
handler.use(
  cors({
    credentials: true
  })
)
