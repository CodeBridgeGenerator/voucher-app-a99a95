
    module.exports = function (app) {
        const modelName = 'cart_history';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            userID: { type: Schema.Types.ObjectId, ref: "users" },
voucherID: { type: Schema.Types.ObjectId, ref: "voucher" },
quantity: { type: Number, required: false, max: 10000000 },
status: { type: Boolean, required: false },
actionDate: { type: Date, required: false },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };