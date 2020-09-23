const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
const axios = require('axios').default;
const _ = require('lodash');
const resultENV = dotenv.config();

if(resultENV.error)
    throw resultENV.error;

const uri = "mongodb+srv://" + process.env.MONGO_USERNAME + ":" + process.env.MONGO_PASSWORD + "@<your-cluster-url>/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let returnArray = [];
const getIGHashTagsData = (async (has_next_page=false, end_cursor='') => {
    let nextPage = (has_next_page) ? '&max_id=' + end_cursor : '';
    let defaultURL = encodeURI(process.env.URL_IG_EXPLORE + process.env.TAGS_VAL + '/?__a=1' + nextPage);
    
    setTimeout(function() {
        console.log('aaaaaaaaaa===>');
        console.log(returnArray);
    }, 5000);

    axios.get(defaultURL)
        .then( response => {
            let hasNextPage = response.data.graphql.hashtag.edge_hashtag_to_media.page_info.has_next_page;
            let endCursor =  response.data.graphql.hashtag.edge_hashtag_to_media.page_info.end_cursor;
            
            _.forEach(response.data.graphql.hashtag.edge_hashtag_to_media.edges, (el, index, arr) => {
                returnArray.push(el.node)
            })

            if(hasNextPage) 
                getIGHashTagsData(hasNextPage, endCursor);
        })
        .catch( error => {
            console.log(error)
            return ('ERROR CONNECTION');
        });
    
    return returnArray;
});


(async ()=>{
    const entireList = await getIGHashTagsData();
    console.log(entireList);
})();

//let responseValue = await getIGHashTagsData();
//console.log('result====>')
//console.log(responseValue.length);
