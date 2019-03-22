import React from 'react';

import { ROOT_QUERY } from '../Users/Users';
import { Query } from 'react-apollo';

export const Photos = () => {
  return (
    <div style={{position: "absolute",top: "35rem", left: "35rem"}}>
        <Query query={ROOT_QUERY}>
            {
                ({loading, data}) => loading ?
                        <p>Loading ...</p>
                        : data.allPhotos.map((photo:any) => {
                            return <img src={photo.url} key={photo.id} alt={photo.name} width={350}/>
                        })
            }
        </Query>
    </div>
  )
}

export default Photos;