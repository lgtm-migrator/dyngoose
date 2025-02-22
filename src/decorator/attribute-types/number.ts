import { DynamoDB } from 'aws-sdk'
import { DynamoAttributeType } from '../../dynamo-attribute-types'
import { ValidationError } from '../../errors'
import { IAttributeType } from '../../interfaces'
import { NumberAttributeMetadata } from '../../metadata/attribute-types/number.metadata'
import { AttributeType } from '../../tables/attribute-type'
import { isNumber, numberToString, stringToNumber } from './utils'

type Value = number | BigInt
type Metadata = NumberAttributeMetadata

export class NumberAttributeType extends AttributeType<Value, Metadata> implements IAttributeType<Value> {
  type = DynamoAttributeType.Number

  toDynamo(value: Value): DynamoDB.AttributeValue {
    if (!isNumber(value)) {
      throw new ValidationError(`Expected ${this.propertyName} to be a number`)
    }

    return {
      N: numberToString(value),
    }
  }

  fromDynamo(value: DynamoDB.AttributeValue): Value | null {
    if (value.N == null) {
      return null
    } else {
      return stringToNumber(value.N)
    }
  }
}
