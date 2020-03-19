# Imports
import tensorflow as tf

# Object detection imports
from utils import backbone
from api import object_counting_api


def count(image="ParkingLot.jpg"):
    input_video = image

    detection_graph, category_index = backbone.set_model('ssd_mobilenet_v1_coco_2018_01_28', 'mscoco_label_map.pbtxt')

    is_color_recognition_enabled = 0

    result = object_counting_api.single_image_object_counting(input_video, detection_graph, category_index, is_color_recognition_enabled) # targeted objects counting

    print (result)
    return result
