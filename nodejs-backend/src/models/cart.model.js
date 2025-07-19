
    module.exports = function (app) {
        const modelName = 'cart';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            quantity: { type: Number, required: false, max: 10000000 },
userID: { type: Schema.Types.ObjectId, ref: "users" },
voucherID: { type: Schema.Types.ObjectId, ref: "voucher" },
AddDate: { type: Date, required: false },

            
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