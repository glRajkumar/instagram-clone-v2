import React from 'react'
import usePhotos from '../Customs/usePhotos'
import { Loading } from '../Common'

function Photos({ id, headers }) {
    const imgCheck = new RegExp('image/*')
    const [initPicLoad, pics, hasMore, picsLoading, picsError, getPhotos] = usePhotos(id, headers)

    return (
        <div>
            {
                !initPicLoad ?
                    <>
                        {
                            pics.length > 0 ?
                                <div className="profile-posts">
                                    {
                                        pics.map(item => {
                                            return (
                                                <div key={item._id}>
                                                    {
                                                        imgCheck.test(item.fileType) ?
                                                            <img
                                                                key={item._id}
                                                                className="item"
                                                                src={`/upload/${item.fileName}`}
                                                                alt={item._id}
                                                            />
                                                            :
                                                            <video
                                                                autoPlay
                                                                loop
                                                                controls
                                                                playsInline
                                                                preload="none"
                                                                src={`/upload/${item.fileName}`}
                                                            >
                                                                your browser doesn't supported
                                                            </video>

                                                    }
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
                            (hasMore && !picsLoading) &&
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