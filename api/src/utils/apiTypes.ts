import {RowDataPacket} from "mysql2";
import {Category, Product} from "../../../commonTypes";

export type CategoryRowDataPacket = Category & RowDataPacket

export type ProductRowDataPacket = Product & RowDataPacket