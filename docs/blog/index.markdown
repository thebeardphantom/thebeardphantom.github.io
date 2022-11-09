---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

#<a href="{{ post.url }}">
#                
            #</a>
            #<br />

layout: default
---

<div style="font-family: monospace;">
    <h1>Posts</h1>
    <table style="width:100%; font-size: 18px;">
        <colgroup>
            <col style="text-align:left; width:5%;">
            <col style="text-align:left; width:5%;">
            <col style="text-align:left">
        </colgroup>
        {% assign sorted = site.posts | sort: 'date' | reverse %}
        {% for post in sorted %}
            <tr>
                <td style="">{{ post.date | date: "%B" }}</td>
                <td>{{ post.date | date: "%Y" }}</td>
                <td style="text-align:left"><a href="{{post.url}}">{{ post.title }}</a></td>
            </tr>
        {% endfor %}
    </table>
</div>