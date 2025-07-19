
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
title: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
expDate: faker.lorem.sentence(1),
value: faker.lorem.sentence(1),
points: faker.lorem.sentence(1),
image: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
