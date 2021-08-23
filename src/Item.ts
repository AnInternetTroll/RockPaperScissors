interface ItemMetadata {
  name: string;
}

export default class Item {
  public weakness: string[];
  public name: string;
  constructor(weakness: string[], metadata: ItemMetadata) {
    this.weakness = weakness;
    this.name = metadata.name;
  }
}
