const body = {
    "state": "12bf1f301be5e2d81aeb514acfa3a03742c20b5e2c424938b7f90f119666445c",
    "code": "cfe36d1bef13447809f651b87ee3ba01c.0.rrvyu.-wn_dX0tPaAST8bJcIE8wg",
    "id_token": "eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoia3IuY28uZGlldGZhcm0iLCJleHAiOjE2MjU3OTk3NjQsImlhdCI6MTYyNTcxMzM2NCwic3ViIjoiMDAxNTg0LjljZjBlMmUwNDUwOTQyYjE4YzgzYWY4MWY4ZDQwNzM3LjAzMDIiLCJjX2hhc2giOiJKeEpDWmVJZmNkR1A2WVQ1SXdHbkV3IiwiZW1haWwiOiJjdzhoY2drOHpwQHByaXZhdGVyZWxheS5hcHBsZWlkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlzX3ByaXZhdGVfZW1haWwiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjI1NzEzMzY0LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.jhKXJwmq2MkPKLydb86qpf0bcPaPL6lphkpNgR9mICyrTLLrdRuYmmV7OwmBwuj216_aXJVJJutd3zHBldca-7fcxY0awo_6zCb0LUAOujGkmrBHoxvoAbfAWlSsMzR_1gOMbtfXawWUqGAwe_ZLgb9m7oedTtbFH5c0HLmbxbKcZQ3g4IXCqYwNUCTprrKSPle1Tn2Cysr2u4lUdOHRMdQ5xc7gmH_Ra9SExgGw4K9l8gWa4F5-aUFH-O4G-rWzPPsgsRilDH87h0-Dkn94nyInSNa18XRMqNBGpcKBBD-7HtGkO5NGFrAOjeVOniKQcd9DFI_8KzIHCIQK2A1N6g",
    "user": {
        "name": {
            "firstName":"해인",
            "lastName":"정"
        },
        "email": "cw8hcgk8zp@privaterelay.appleid.com"
    }
}

// const token = "eyJraWQiOiJlWGF1bm1MIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoia3IuY28uZGlldGZhcm0iLCJleHAiOjE2MjU1NDI2NzcsImlhdCI6MTYyNTQ1NjI3Nywic3ViIjoiMDAxNzAwLjU1OTUzYWJhYjQ1ZTQxYzlhNWM5ZGFkNzE2YTFlYzIxLjAyMzgiLCJjX2hhc2giOiJsQ3BnM052T0Zya1M5WWxLOXZoRE13IiwiZW1haWwiOiJkYXRhZmxvdzA5MDFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjI1NDU2Mjc3LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.mdLIAIWUwOLsKOzjvSY-t69s4noou_F7PGxbjZaAv7jmcXko1YtYT9RMqgbL8KTiGvB1le0s7kt4k3jf2AiY_xSqUM4q6pmPd2HP5q7yE0PkWcped6VET5X6ehu5kcn642q9V9nbmEY6P5l11xCds9Qrl440vm9n5FdmUJ6GWhgIxt0NOQtkoc6XPb-O_xVAHdBR_ctJLM0yq3A0i-CqmyHp_6iPyuL0DBp_4-ucHSh5IsRVVC2dzM3OuL6fOwXfrrg7aMGOXsY_dHbSk1u89_qZXDRRm2X7HJxdyBLiFsb_XomHeygqkrqmAxl-XaOYO0tn2YmkwStZK2NsBiVjMQ";

const tokens = body.id_token.split('.');

const parsed = decodeBase64(tokens);
let params = {
    header: parsed[0],
    content: parsed[1],
    user: body.user
}
console.log(params)

function decodeBase64(array) {
    const decodes = new Array();
    array.forEach(v => {

        const decoded = Buffer.from(v, "base64").toString('utf8');
        if(decoded.includes('{') && decoded.includes(':') &&decoded.includes('}')) {
            let json = JSON.parse(decoded)
            decodes.push(json);
        }
    })

    return decodes
}

