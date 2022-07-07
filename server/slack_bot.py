"""
    Slack bot to publish the server hostname.
"""

import os

from slack import WebClient


def publish_hostname() -> None:
    host = os.popen("hostname -I | awk '{print $1;}'").read()[0:-1]
    token = os.environ.get('SLACK_TOKEN')
    if token is not None:
        slack_client = WebClient(token)
        slack_client.chat_postMessage(
            channel="reading_to_robot",
            text="Access Speech Learning App in: http://{}:5002".format(host))


if __name__ == '__main__':
    publish_hostname()
