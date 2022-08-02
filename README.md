# JS-IPTV-PlayList-Editor
This is a simple javascript editor for m3u, m3u8 files.

The editor works only in desktop versions of Chrome, Chromium, Erge, Opera, Yandex Browser.
	To download a playlist file, use the `Download` key. You can upload multiple files to combine them. When you press the `Save` key, the playlist will be saved in the desired folder on your computer. If you click on a table cell in one of the columns "Name", "Group", "Icon", "TVG Name", "URL", you can edit their value for any of the channels. When you click on the channel number, the entire row is highlighted. After that, operations of moving it down or up or deleting the channel are available for it. Pressing the channel number again removes the highlighting.
	`Icon X>Y` and `URL X>Y` keys are used for mass renaming of icon addresses and channel addresses (replacing part of the text string by another) on all channels. 
	The `EPG Test` key is used to check all channels for the correspondence of TV program names. Only the XML format of the TV program is supported. If the function does not work, try changing the protocol from http:// to https:// in the "TV-Guide:" line. The cells with the names of TV channels that are in the TV program file are highlighted in green, the others are highlighted in pink.
	The `URL Test` key is used to check the response of the TV program URL server on a mass scale.  If the server response code is 200, the cell with the channel address is recolored in green, otherwise in pink. It can work for a very long time.
	The `Auto complete` button is used to automatically arrange the icon addresses and TV program names according to the TV program program file. Works only after pressing `EPG Test`.
