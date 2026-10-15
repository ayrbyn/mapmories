import PlaceController from './PlaceController'
import PlacePhotoController from './PlacePhotoController'
const Controllers = {
    PlaceController: Object.assign(PlaceController, PlaceController),
PlacePhotoController: Object.assign(PlacePhotoController, PlacePhotoController),
}

export default Controllers