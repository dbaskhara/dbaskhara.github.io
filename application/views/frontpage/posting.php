<!-- Page Header -->
<header class="masthead" style="background-image: url('http://localhost/blog/img/contact-bg.jpg')">
    <div class="overlay"></div>
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-md-10 mx-auto">
                <div class="page-heading">
                    <h1>Create Your Post</h1>
                    <span class="subheading">Let everyone knows your story and make them feel happy.</span>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Main Content -->
<div class="container">
    <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
            <p></p>
            <form name="sentMessage" id="contactForm" action="<?= base_url() ?>Welcome/SendPost" method="POST" novalidate>
                <div class="control-group">
                    <div class="form-group floating-label-form-group controls">
                        <label>Title</label>
                        <input name="title" type="text" class="form-control" placeholder="Title" id="name" required data-validation-required-message="Please put your title.">
                        <p class="help-block text-danger"></p>
                    </div>
                </div>
                <div class="control-group">
                    <div class="form-group floating-label-form-group controls">
                        <label>Story</label>
                        <textarea name="story" rows="5" class="form-control" placeholder="Story" id="message" required data-validation-required-message="Please enter your story."></textarea>
                        <p class="help-block text-danger"></p>
                    </div>
                </div>
                <div class="control-group">
                    <div class="form-group col-xs-12 floating-label-form-group controls">
                        <label>Username</label>
                        <input name="username" type="text" class="form-control" placeholder="Username" id="phone" required data-validation-required-message="Please enter your phone number.">
                        <p class="help-block text-danger"></p>
                    </div>
                </div>
                <br>
                <div id="success"></div>
                <button type="submit" class="btn btn-primary" id="sendMessageButton">Send</button>
            </form>
        </div>
    </div>
</div>

<hr>