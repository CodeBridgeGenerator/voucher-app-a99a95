
import { faker } from "@faker-js/faker";
export default (user,count,userIDIds,voucherIDIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
userID: userIDIds[i % userIDIds.length],
voucherID: voucherIDIds[i % voucherIDIds.length],
quantity: faker.date.past(""),
status: faker.date.past(""),
actionDate: faker.date.past(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
