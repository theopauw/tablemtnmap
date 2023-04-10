from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

@login_required
def index(request):
    context = {
        'for_later': 0,
    }
    # Render the HTML template index.html with the data in the context variable
    return render(request, 'tablemtnmap/index.html', context=context)
