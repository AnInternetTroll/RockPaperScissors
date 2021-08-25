interface ItemMetadata {
  name: string;
  picture: string;
}

export default class Item {
  public weakness: string[];
  public name: string;
  public picture: string;

  constructor(weakness: string[], metadata: ItemMetadata) {
    this.weakness = weakness;
    this.name = metadata.name;
    this.picture = metadata.picture;
  }
}
