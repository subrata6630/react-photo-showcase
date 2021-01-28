import React, { Component } from 'react'
import axios from 'axios'
import downloadIcon from './download.svg'


export default class LatestPhotos extends Component {
    

    state = {
        photos: [],
        page: 1,
        loading: true,
        search_query: '',
        searching: false
    }

    componentDidMount() {
        axios.get('https://api.unsplash.com/photos/?client_id=46586f7407af308759850cb7358451640c67d0268f31f45ac1d9103443379ce9&per_page=16&page='+ this.state.page).then(
            res => this.setState({
                photos: res.data,
                loading: false,
                page: this.state.page + 1
            })
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    loadNextPage = (e) => {

        axios.get('https://api.unsplash.com/photos/?client_id=46586f7407af308759850cb7358451640c67d0268f31f45ac1d9103443379ce9&per_page=16&page='+ this.state.page).then(
            res => this.setState({
                photos: res.data,
                loading: false,
                page: this.state.page + 1
            })
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    searchQuery = (e) => {
        this.setState({
            search_query: e.target.value
        })
        
    }

    searchTrigger = (e) => {
        this.setState({
            loading: true
        })
        axios.get('https://api.unsplash.com/search/photos/?client_id=46586f7407af308759850cb7358451640c67d0268f31f45ac1d9103443379ce9&query=' + this.state.search_query + '&per_page=16&page='+ this.state.page).then(
            res => this.setState({
                photos: res.data.results,
                loading: false,
                page: 1,
                searching: true,
                total_found: res.data.total,
                total_found_pages: res.data.total_pages
            })
        )
        e.preventDefault();
    }

    loadNextSearchPage = (e) => {
        this.setState({
            loading: true
        })
        axios.get('https://api.unsplash.com/search/photos/?client_id=46586f7407af308759850cb7358451640c67d0268f31f45ac1d9103443379ce9&query=' + this.state.search_query + '&per_page=16&page='+ this.state.page).then(
            res => this.setState({
                photos: res.data.results,
                loading: false,
                page: this.state.page + 1,
                searching: true,
                total_found: res.data.total,
                total_found_pages: res.data.total_pages
            })
        )

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }



    render() {

        var searchHeadin = '';
        var searchBtnMarkup = '';
        var searchinfo = '';
        if(this.state.searching === true) {
            searchHeadin = <h2>You searched with <i>{this.state.search_query}</i></h2>
            if(this.state.total_found_pages <= this.state.page) {
                searchBtnMarkup = ''
            } else {
                searchBtnMarkup = <button className="btn btn-success" onClick={this.loadNextSearchPage}>Load Page {this.state.page + 1}</button>
                
            }
            
            searchinfo = <span>Total found {this.state.total_found} | Page {this.state.page} of {this.state.total_found_pages}</span>

        } else {
            searchHeadin = <h2>Latest Photos</h2>
            searchBtnMarkup = <button className="btn btn-success" onClick={this.loadNextPage}>Load Page {this.state.page}</button>
            searchinfo = ''
        }

        if(this.state.loading === true) {
            return (
                <div className="row text-center"><div className="col">Loading</div></div>
            )
        } 

        return (
            <React.Fragment>
                <div className="row top-heading">
                    <div className="col my-auto">{searchHeadin} {searchinfo}</div>
                    <div className="col col-auto my-auto">
                        <form onSubmit={this.searchTrigger} action="">
                            <input type="text" value={this.state.search_query} onChange={this.searchQuery} placeholder="Search keyword"/>
                            <input type="submit" value="search"/>
                        </form>
                    </div>
                </div>
                
                <div className="row">
                    
                
                
                {
                    this.state.photos.map((photo) => (
                        <div key={photo.id} className="col-lg-3">
                            <div className="single-photo-item">
                                <a className="d-block" href={'photo?id=' + photo.id}>
                                    <div className="photo-wrapper">
                                        <img src={photo.urls.small} alt={photo.description}/>
                                    </div>
                                    <h5>{photo.description}</h5>
                                    <p className="cat-name">by - {photo.user.first_name} {photo.user.last_name}</p>
                                </a>

                                <a className="dl-icon" rel="noopener noreferrer" title="Download" target="_blank" href={photo.links.download} download><img src={downloadIcon} alt="download"/></a>
                            </div>
                        </div>
                    ))
                }

                </div>


                <div className="row">
                    <div className="col-lg-12 text-center">
                        <div className="load-more-btn">{searchBtnMarkup}</div>
                    </div>
                </div>
            </React.Fragment>
        )


        
    }
}
