class Apifeatures {
    constructor(query , queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex:this.queryStr.keyword,
                $options:"i",
            },
        } : {};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const genre = this.queryStr.genre || "Manga";
        const min_price = this.queryStr.min_price || 0;
        const max_price = this.queryStr.max_price || 100000;
        let filter_query = {
            price:{ $gt:min_price, $lt:max_price}
        }
        if(genre !== "All")filter_query = {...filter_query,genre:genre}
        this.query = this.query.find(filter_query);
        return this;
    }
}

export default Apifeatures;