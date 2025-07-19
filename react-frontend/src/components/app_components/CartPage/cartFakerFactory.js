
import { faker } from "@faker-js/faker";
export default (user,count,userIDIds,voucherIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
quantity: faker.datatype.number(""),
userID: userIDIds[i % userIDIds.length],
voucherID: voucherIDIds[i % voucherIDIds.length],
AddDate: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
