const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        desc: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data)
            }
        }
    })

})

const RelativeType = new GraphQLObjectType({
    name: 'Relative',
    fields: {
        parents: { type: GraphQLString },
        childs: { type: GraphQLString }
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        1999: { type: GraphQLString },
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age1: { type: GraphQLInt },
        relatives: { type: RelativeType },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)

            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(resp => resp.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(resp => resp.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})