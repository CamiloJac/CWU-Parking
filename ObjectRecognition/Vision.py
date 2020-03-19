import cv2
import time

class Webcam:
    def __init__(self, timeInterval=5):
        self.timeInterval = timeInterval
    
    def capture(self):
        key = cv2.waitKey(1)
        webcam = cv2.VideoCapture(0)

        try:
            check, frame = webcam.read()
            print(check)  # prints true as long as the webcam is running
            print(frame)  # prints matrix values of each framecd
            cv2.imshow("Capturing", frame)
            key = cv2.waitKey(1)
            img_name = "ParkingLot.jpg"
            cv2.imwrite(img_name, frame)
            start_time = time.time()
            webcam.release()
            cv2.destroyAllWindows()
        
        except(KeyboardInterrupt):
            print("Error")

        return img_name