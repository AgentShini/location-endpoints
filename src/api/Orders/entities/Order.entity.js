const { Schema, Model } = require('../../../services/database');
const  FUEL_TYPE = ["KEROSENE", "PETROL","DISEL"];
const STATUS = ["PENDING", "ONROUTE", "RETURNED", "DELIVERED"]

const OrderSchema = new Schema({
    id: Schema.Types.ObjectId,
    destination: { type: String, default: ''},
    rideID: Schema.Types.ObjectId,
    paymentID: Schema.Types.ObjectId,
    driverID: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    delivery_Code: { type: Number, default: 0},
    fuel_type : { type: String, enum: FUEL_TYPE},
    amount_in_litres: { type: Number, default: 0},
    status:{ type: String, default: "PENDING", enum: STATUS },
    Suggested_Delivery_Time:{ type: Date},
    
},{ timestamps: true, minimize: false, id: true });

module.exports = Model('Orders', OrderSchema);