import React from 'react';
import Gallery from 'react-grid-gallery';


class Portfolio extends React.Component {
  render() {
    const images = [];
    for(let i=0; i<this.props.images.length; i++) {
      const image = this.props.images[i];
      images.push({
        src: 'http://crabfactory.net' + image.image_file,
        thumbnail: 'http://crabfactory.net' + image.image_file,
        caption: image.description,
      })
    }

    return (
      <Gallery
        images={images}
        rowHeight={this.props.imageSize}
        enableImageSelection={false}
      />
    );
  }
}

export default Portfolio;
