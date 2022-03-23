import PagenoteAxios,{API} from '../src/serverApi'
import { equal } from "assert";

const api = new PagenoteAxios({
    did: "",
    extensionVersion: "",
    listeners: undefined,
    token: ""
})

describe("Typescript usage suite", () => {
    it("should be able to execute a test", () => {
        api.get(API.graphql.user.query.path,{}).then(function (result) {
            console.log(result)
        })
    });

});

