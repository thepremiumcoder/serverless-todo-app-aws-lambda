import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/toDos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('ToDoUploadUrlHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    //Activity  Log ::  Generating  Upload Url for Todo Item
    logger.info(
      'Todo Upload Url Handler :: ',
      'Attempt Generating  Upload Url for Todo Item'
    )
    const user = getUserId(event)
    const url = await createAttachmentPresignedUrl(todoId, user)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }

    // return undefined
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
