import time
from Vision import Webcam
import single_image_object_counting as ObjCnt

if __name__ == "__main__":
    cam1 = Webcam(5)
    start_time = time.time()

    while True:
        if time.time() - start_time >= cam1.timeInterval: # check if n sec passed
            start_time = time.time()
            image = cam1.capture()
            currCount = ObjCnt.count(image)
            if "'car:': " in currCount:
                print(currCount.split("'car:': ")[1][0] + " car(s) found")
            else: 
                print("no cars found")