import React, { useRef } from 'react'

function Slider({ files }) {
    const filesLen = files.length
    const imgRef = useRef(null)
    const img = new RegExp('image/*')
    let current = 0

    const cl = (rgt) => {
        if (rgt) {
            current -= 100
            imgRef.current.style.transform = `translate(${current}%)`
        } else {
            current += 100
            imgRef.current.style.transform = `translate(${current}%)`
        }
    }

    return (
        <div className="post-img">
            <div ref={imgRef}>
                {
                    files.map((file, i) => {
                        return (
                            <div key={file._id}>
                                {
                                    <p className="post-len"> {`${i + 1} / ${filesLen}`} </p>
                                }

                                {
                                    i > 0 &&
                                    <p id="arrow-left" className="arrow" onClick={() => cl(false)}></p>
                                }

                                {
                                    img.test(file.fileType) ?
                                        <img
                                            src={`/upload/${file.fileName}`}
                                            alt={file._id}
                                        />
                                        :
                                        <video
                                            autoPlay
                                            loop
                                            controls
                                            playsInline
                                            preload="none"
                                            src={`/upload/${file.fileName}`}
                                        >
                                            your browser doesn't supported
                                    </video>
                                }

                                {
                                    i < filesLen - 1 &&
                                    <p id="arrow-right" className="arrow" onClick={() => cl(true)}></p>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Slider