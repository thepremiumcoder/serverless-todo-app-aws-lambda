import * as AWS from 'aws-sdk'
import { Types } from 'aws-sdk/clients/s3'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosDataAccess')

// TODO: Implement the dataLayer logic

export class ToDoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    // private readonly todoIndex = process.env.INDEX_NAME,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME,
    private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' })
  ) {}

  async getAllToDo(userId: string): Promise<TodoItem[]> {
    //Activity  Log ::  Fetching Todo Item in DynamoDB
    logger.info('Fetch Todo DataLayer :: ', 'Fetching Todo Item in DynamoDB')

    //Build Query Parameters
    const queryParams = {
      TableName: this.todoTable,
      // KeyConditionExpression: 'userId = :userId',
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(queryParams).promise()
    logger.info(result)

    const items = result.Items

    return items as TodoItem[]
  }

  async createToDo(todoItem: TodoItem): Promise<TodoItem> {
    //Activity  Log ::  Creating Todo Item in DynamoDB
    logger.info('Create Todo DataLayer :: ', 'Creating Todo Item in DynamoDB')

    const queryParams = {
      TableName: this.todoTable,
      Item: todoItem
    }

    const result = await this.docClient.put(queryParams).promise()
    logger.info(result)

    return todoItem as TodoItem
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    //Activity  Log ::  Updating Todo Item in DynamoDB
    logger.info('Update Todo DataLayer :: ', 'Updating Todo Item in DynamoDB')

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    logger.info(result)
    const attributes = result.Attributes

    return attributes as TodoUpdate
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    //Activity  Log ::  Deleting Todo Item in DynamoDB
    logger.info('Delete Todo DataLayer :: ', 'Deleting Todo Item in DynamoDB')

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    const result = await this.docClient.delete(params).promise()
    logger.info(result)

    return null as string
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    //Activity  Log ::  Generating Upload Url from S3
    logger.info(
      'Generate Upload Url DataLayer :: ',
      'Generating Upload Url from S3'
    )
    logger.info('Generating URL')

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000
    })
    logger.info(url)

    return url as string
  }
}
