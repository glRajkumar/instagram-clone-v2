import React from 'react'
import tab from '../../Img/tab.png'
import video from '../../Img/video.png'

function NoSlider({ files }) {
    const filesLen = files.files.length
    const imgCheck = new RegExp('image/*')

    return (
        <>
            {
                filesLen > 1 &&
                <>
                    {
                        imgCheck.test(files.files[0].fileType)
                            ? <img className="post-top" src={tab} alt="tab" />
                            : <img className="post-top" src={video} alt="video" />
                    }
                </>
            }

            {
                imgCheck.test(files.files[0].fileType) ?
                    <img
                        key={files.files[0]._id}
                        className="item"
                        src={`/upload/${files.files[0].fileName}`}
                        alt={files.files[0]._id}
                    />
                    :
                    <video src={`/upload/${files.files[0].fileName}`}>
                        your browser doesn't supported
                    </video>
            }
        </>
    )
}

export default NoSlider