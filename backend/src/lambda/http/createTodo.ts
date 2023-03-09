import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/toDos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateToDoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    //Activity  Log ::  Creating Todo Item
    logger.info('Create Todo Handler :: ', 'Attempt Creating Todo Item')

    const user = getUserId(event)
    const createItem = await createTodo(newTodo, user)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: createItem
      })
    }

    // return undefined
  }
)

handler.use(
  cors({
    credentials: true
  })
)
