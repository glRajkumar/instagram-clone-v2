import React from 'react'
import usePhotos from '../Customs/usePhotos'
import { Loading } from '../Common'
import { useHistory } from 'react-router-dom'
import NoSlider from './NoSlider'

function Photos({ id, headers }) {
    const { initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos } = usePhotos(id, headers)
    const history = useHistory()

    return (
        <div>
            {
                !initPicLoad ?
                    <>
                        {
                            pics.length > 0
                                ?
                                <div className="profile-posts">
                                    {
                                        pics.map(files => {
                                            return (
                                                <div key={files.files[0]._id} className="post-container" onClick={() => history.push(`/othersposts/${id}`)}>
                                                    <NoSlider files={files} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : <h3 className="text-center">No post yet</h3>
                        }

                        {
                            picsLoading &&
                            <div className="rel-pos"><Loading /></div>
                        }

                        {
                            hasMore && !picsLoading &&
                            <button onClick={getPhotos}>Load more</button>
                        }

                        {
                            picsError && <div>Error</div>
                        }
                    </>
                    : <div className="rel-pos"><Loading /></div>
            }
        </div>
    )
}

export default Photos