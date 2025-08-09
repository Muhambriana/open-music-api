class SuccessTypeEnum {
  constructor(code, key, defaultMessage) {
    this.code = code;
    this.key = key;
    this.defaultMessage = defaultMessage;
  }

  message(itemName) {
    return this.defaultMessage.replace('{item}', itemName);
  }

  static SUCCESS = new SuccessTypeEnum(200, 'ok', 'success');

  static SUCCESSFULLY_CREATED = new SuccessTypeEnum(201, 'successfully_created', '{item} created successfully');

  static SUCCESSFULLY_UPDATED = new SuccessTypeEnum(200, 'successfully_updated', '{item} updated successfully');

  static SUCCESSFULLY_DELETED = new SuccessTypeEnum(200, 'successfully_deleted', '{item} deleted successfully');
}

Object.freeze(SuccessTypeEnum); // Prevent further modification

export default SuccessTypeEnum;
