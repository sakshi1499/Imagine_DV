<%#
<% post.bookmarkedUsers.forEach(marker=>{ %>
  <% if(userId && post.bookmarked && post.createdBy==marker) {%>
    <i value="<%= userId %>" id="<%= post._id %>" style="position:absolute; cursor:pointer;  right:1.5rem; margin:3px;  color:gold;  "
      class=" bm bookmark<%= post._id %>  fa fa-bookmark"></i>
 <% } %>
 <% }) %>
 <% if(userId && !post.bookmarked) {%>
 <i value="<%= userId %>" id="<%= post._id %>" style="position:absolute; cursor:pointer;  right:1.5rem; margin:3px;    "
   class="bm bookmark<%= post._id %>  fa fa-bookmark"></i>
   <% } %>



%>
