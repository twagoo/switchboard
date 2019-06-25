package eu.clarin.switchboard.core;

import org.slf4j.LoggerFactory;

import java.net.MalformedURLException;
import java.net.URL;

public class DownloadUtils {
    private static final ch.qos.logback.classic.Logger LOGGER = (ch.qos.logback.classic.Logger) LoggerFactory.getLogger(DownloadUtils.class);

    public static class LinkData {
        String filename;
        String downloadLink;

        public String getFilename() {
            return filename;
        }

        public String getDownloadLink() {
            return downloadLink;
        }
    }

    public static LinkData getLinkData(String link) throws MalformedURLException {
        LinkData linkData = new LinkData();
        linkData.downloadLink = link;

        URL url = new URL(link);
        String host = url.getHost();
        String path = url.getPath();
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }

        linkData.filename = path;
        int lastSlash = path.lastIndexOf("/");
        if (lastSlash >= 0) {
            linkData.filename = path.substring(lastSlash + 1, path.length());
        }

        if (host.equals("b2drop.eudat.eu")) {
            linkData.filename = "b2drop_file";
            if (!path.endsWith("/download")) {
                path += "/download";
                linkData.downloadLink = new URL(url.getProtocol(), url.getHost(), path).toString();
            }
        } else if (url.getHost().equals("www.dropbox.com") || url.getHost().equals("dropbox.com")) {
            if (!link.contains("?dl=1")) {
                linkData.downloadLink = link.replaceFirst("\\?dl=0", "?dl=1");
            }
        }
        LOGGER.debug("linkData: " + linkData.filename + "; " + linkData.downloadLink);
        return linkData;
    }
}