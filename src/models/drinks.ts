import { ObjectId } from "mongodb";

export default interface Drink {
  name: string;
  type: string;
  rating: number;
  acquiredDate: Date;
  imageUrl?: string; 
  id?: ObjectId;
}