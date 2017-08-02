import React from 'react';
import Gallery from 'react-grid-gallery';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/main.css';
import 'react-responsive-carousel/lib/styles/carousel.css';


class Illustration extends React.Component {
  render() {
    const images = [];
    let gallery;
    let slider;
    for(let i=0; i<this.props.images.length; i++) {
      const image = this.props.images[i];
      images.push({
        src: 'http://crabfactory.net' + image.image_file,
        thumbnail: 'http://crabfactory.net' + image.image_file,
        caption: image.description,
      })
    }
    gallery = (
      <Gallery
        images={images}
        rowHeight={200}
        enableImageSelection={false}
        onClickThumbnail={this.props.setSelectedItem}
      />
    );
    slider = (
      <Carousel
        className="illustration"
        axis="horizontal"
        showThumbs={false}
        showArrows={true}
        showStatus={false}
        showIndicators={false}
        selectedItem={this.props.selectedItem}
        onChange={this.props.setSelectedItem}
        dynamicHeight
      >
        {this.props.images.map(image => (
          <div key={image.id}>
            <img src={'http://crabfactory.net' + image.image_file} alt='image' />
          </div>
        ))}
      </Carousel>
    )

    return (this.props.browseMode ? slider : gallery);
  }
}

Illustration.defaultProps = {
  selectedItem: 0,
  browseMode: false,
};

export default Illustration;
