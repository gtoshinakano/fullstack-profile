import React, { ReactElement } from 'react'
import Image from 'next/image'
import prefix from '@/helpers/prefix'
import customLoader from '@/helpers/customLoader'

const Introduction = (): ReactElement => {
  return (
    <section className='space-y-10'>
      <h1 className='font-futura mb-16 text-5xl capitalize text-heroGray'>
        my UI/UX Guide
      </h1>
      <ul className='space-y-5 list-disc list-inside font-normal'>
        <li>How would it be a useful App interface?</li>
        <li>How can we provide a more efficient outcome from our screens?</li>
        <li>
          How can we make it so useful that it can become a Habit forming
          product?
        </li>
      </ul>
      <p>
        Those are all universal questions that we make ourselves when thinking
        on projects involving users.
      </p>
      <p>
        My latest projects had pushed myself to learn about something that we
        can say is every developer's weak point.
      </p>
      <p className='italic text-ternary font-bold'>
        The design part of the whole thing.
      </p>
      <p>
        By studying it I realized that in order to be better at it, I needed:
      </p>
      <ul className='space-y-5 list-decimal list-inside font-normal'>
        <li>To be more creative while thinking on solutions.</li>
        <li>
          To understand better people's minds to make things more attractive.
        </li>
        <li>
          To practice following basic design principles to communicate better
          and effectively.
        </li>
      </ul>
      <p>
        While further practicing, I learned concepts that I will keep using in
        all my future projects and I'm going to teach you here for free.
      </p>
      <p>
        Maybe it can be useful for you too, as it was for me. Or maybe you can
        get only what makes sense for you.
      </p>
      <p>
        I call it{' '}
        <span className='capitalize text-primary font-bold'>
          the 3-3-3 principles for a better UX
        </span>
        .
      </p>
      <h2 className='font-futura text-5xl pt-16'>
        The
        <span className='text-secondary'> 3</span>-
        <span className='text-figmaBlue'>3</span>-
        <span className='text-primary'>3 </span>
        Principles
      </h2>
      <p>
        Once I have heard that <b className='tracking-wider'>Three</b> is some
        kind of a magical number.
      </p>
      <p>
        It symbolizes simplicity and everything in a cycle of three can have the
        meaning of beginning, middle and end.
      </p>
      <p>
        These key principles consists of 3 communication goals, 3 basic design
        rules and 3 life learnings applicable to UI/UX.
      </p>
      <p>I will try to be clear explaining each of them.</p>
      <h3 className='font-futura text-2xl md:text-4xl pt-4 md:pt-10'>
        <span className='text-secondary'>3</span> Communication Goals
      </h3>
      <p>
        Once I read on a book that when a communicator has a message to his
        audience, he has 3 consecutive goals to be achieved in order to deliver
        it successfully.
      </p>
      <p>The first goal is:</p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-secondary'>1/3</span> Cause a reflection
      </h3>
      <p>Let's say you are trying to sell something to an audience.</p>
      <p>
        If you start by saying: "This is my product, please, buy it" you will
        instantly ruin your sales because the audience needs more information
        before buying something from you.
      </p>
      <p>
        Not only do they need more information, but also they need to feel that
        buying a product from you is something that will be worth the price they
        are paying for.
      </p>
      <p>
        And in order to feel that, people need a motivation. They need to feel
        that your product will impact their lives in some positive way.
      </p>
      <p>
        You need to show them that you know how they feel bad about the problems
        they have without having your product.
      </p>
      <p>You have to lead them to a reflection in their minds. </p>
      <p>
        Make them think: "Wow, this is true, I have those problems. Does this
        person knows how to solve it?"
      </p>
      <p>
        And then they will give a lot more attention to your message, then you
        can possibly make a sale or whatever you are trying to help them
        achieve.
      </p>
      <p>
        A reflection can manifest in many shapes like curious information,
        life-changing insights, or an advice from an authority.
      </p>
      <p>
        But as salesperson, we can't make too much if we only make an audience
        reflect about the problem they have.
      </p>
      <p>
        They can say things like: "Okay, It all makes sense, but..." and there
        is all kind of imaginable "buts".
      </p>
      <p>
        And, generally, the sentence after the word "but" is something that
        kills sales.
      </p>
      <p>
        You need to be a little bit preciser in your message and achieve the
        second communication goal, that is:
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-secondary'>2/3</span> Make them take a Decision
      </h3>
      <p>
        Okay, you got that making the audience reflect is very good, but it is
        not enough for you to make a sale. Right?
      </p>
      <p>
        That happens because naturally, people's standard reaction to a
        salesperson is to create objections in those situations.
      </p>
      <p>They need to protect themselves from being scammed, right?</p>
      <p>
        It is our duty to know it and to be prepared for, when we are
        communicating.
      </p>
      <p>
        And sometimes, the objection is just that the audience still had too
        many choices after our communication.
      </p>
      <p>And many choices simply confuses people's mind.</p>
      <p>Being precise with the message can fix that problem. </p>
      <p>
        We have to let it clear to our audience that they don't have many
        choices or that, by choosing us, they are making the best choice.
      </p>
      <p>So making your audience think:</p>
      <p className='italic font-light'>
        {' '}
        "Okay, I got that gas-moving cars are not good, you told me that hybrid
        cars have those other problems too, so I have decided that my next car
        will be an electric one!"
      </p>
      <p>
        You caused them a reflection, you gave them choices and they have taken
        a decision.
      </p>
      <p>
        It would be a great outcome if you were an electrical cars seller, but
        only that decision made should not be enough for you.
      </p>
      <p>You want them to buy it now, right?</p>
      <p>
        But unfortunately, they might say the most feared combination of words
        after the word "but" ever:
      </p>
      <p className='font-bold'>"But not now..."</p>
      <p>And then we panic, right?</p>
      <p>
        I'm just kidding. That is why we have the third goal of communication.
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-secondary'>3/3</span> Make them take an action
      </h3>
      <p>
        If your audience had taken a decision, that's good. But there is still
        something that can make it even better.{' '}
      </p>
      <p>Their behavior as a consequence of your communication.</p>
      <p>
        And by "behavior", I mean actions like buying a product, subscribing to
        a list, donating to a cause, cleaning the room, and so on.
      </p>
      <p>
        If you are an electrical cars seller, you want your audience to buy them
        from you.
      </p>
      <p>A digital marketing guru from the internet once said:</p>
      <p>
        When people says "Not now", actually they wanted to say "It's not a
        priority for me".
      </p>
      <p>
        Which means that they need a really good reason to make some effort to
        accept your offer.
      </p>
      <p>
        And the trick here is, you will have to give them some sense of urgency
        and scarcity.
      </p>
      <p>
        You can say things like: "The opportunity of paying less is only
        happening today!"{' '}
      </p>
      <p>And it need to be true, okay?</p>
      <p>
        So people will feel that they only have that short time to get
        benefitted from that opportunity.
      </p>
      <p>Then they will become more likely to buy your product.</p>
      <p>And, I hope you got it.</p>
      <p>
        The action taken is the third ingredient for a good and objective
        communication.
      </p>
      <p>
        It's all related to a good UX Design and I'm going to connect the
        concepts throughout this article.
      </p>
      <h3 className='font-futura text-2xl md:text-4xl pt-4 md:pt-10'>
        <span className='text-figmaBlue'>3</span> Basic Design Principles
      </h3>
      <p>I used to think like that:</p>
      <p>
        "What differentiate a good design from a bad one is if it is beautiful
        or if it hurts our eyes."{' '}
      </p>
      <p>
        And by "beautiful", I meant, made by someone with some kind of super
        artistic talent.
      </p>
      <p>Too naive, right?</p>
      <p>
        What I was missing was that there is some patterns that if present,it
        can make a design very effective.
      </p>
      <p>
        Visual people have more sensitivity to catch these patterns, but
        auditive people like me doesn't capture it very well, unless it's
        explicit and well explained.
      </p>
      <p>
        It took me a while to learn, but let me try to explain in my own words.
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-figmaBlue'>1/3</span> It's about evoking emotions
      </h3>
      <p>Have you ever asked yourself what makes you buy something?</p>
      <p>
        And I'm not asking about product features, I'm asking about what happens
        to you when you decide to buy something.
      </p>
      <p>
        When we feel certain emotions, we tend to take decisions and actions
        easily, and without thinking too much.
      </p>
      <p>
        For example, if you know that that product you've always wanted is going
        to be out of stock soon, it will make you feel that feeling of urgency
        and scarcity I told you earlier.
      </p>
      <p>
        Then, it will make you decide if you will let this chance go or if you
        will act and buy it at that moment.
      </p>
      <p>
        In the design field, the main purpose is to get people's attention and
        evoke emotions.
      </p>
      <p>
        A "beautiful design" I told you earlier means a piece of design that
        perfectly express its purpose and make the viewer feel the right
        emotions.
      </p>
      <p>
        And a design that "hurts our eyes" are the ones that simply can't be
        precise to show it's purpose and the evoked emotion is bad.
      </p>
      <p>
        That's why busy images or too many buttons and actions on interfaces are
        a bad practice.
      </p>
      <p>Because the purpose is to make people click, buy, subscribe, right?</p>
      <p>
        You will see my design from 2011, and you can see what might be
        considered a bad design.
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-figmaBlue'>2/3</span> The AIA Composition
      </h3>
      <p>
        Compositions are how the elements that compounds a piece of design or an
        interface are placed on a stage.
      </p>
      <p>
        A good composition means that the elements that compounds a design are
        well placed on the viewport and as a result, it can lead the viewer's
        attention to an action by evoking the right emotions.
      </p>
      <p>
        And we've just seen that "busy design" evokes confusion, right? And by
        busy, I meant too many elements competing for your attention on the
        stage.
      </p>
      <p>
        That is why the effective composition is only made of 3 elements. I call
        them the <span className='text-primary'>Attract</span>,{' '}
        <span className='text-primary'>Intrigue</span> and{' '}
        <span className='text-primary'>Act</span> elements.{' '}
      </p>
      <p>Let's see a good example of if:</p>
      <div className='w-full'>
        <Image
          src={`${prefix}/img/dev/gabriel/ss-netflix.png`}
          width={1289}
          height={731}
          layout={'intrinsic'}
          loader={customLoader}
          unoptimized
        />
      </div>
      <ul className='space-y-5 list-decimal list-inside font-normal'>
        <li>
          You can see a big background that is the grid of covers from available
          movies and shows (Attract).
        </li>
        <li>
          A middle sized element that can be all elements in white color
          including the Email address input. (Intrigue)
        </li>
        <li>
          And a few small items in red, like the logo, the sign in button and
          the Get Started button(Action)
        </li>
      </ul>
      <p>
        Everything balanced, great color usage, there is a 3D perspective that
        gives a sense of infinite possibilities.
      </p>
      <p>
        It is clear for our eyes to get what to do when landing on this page.{' '}
      </p>
      <p>
        The three elements are clearly sized, it doesn't compete with each
        other, one put your focus into another.
      </p>
      <p>
        You can be use the AIA Composition with Fibonacci's Golden Ratio and the
        results can be amazing!
      </p>
      <p>It is more powerful if you use with the next one.</p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-figmaBlue'>3/3</span> The Perfect Color Proportion
      </h3>
      <p>
        I can't say that there is a magic formula to get a perfect color
        palette, because it doesn't exist.
      </p>
      <p>
        But, recently, I discovered that there is another magic <b>Three</b>.
      </p>
      <p>
        And before I knew it, I didn't know how to dose color's quantity on a
        page.
      </p>
      <p>
        So I chose color palettes, randomly applied it to my CSS and the results
        was always too colorful.
      </p>
      <p>Look at the first site I made, in 2011:</p>
      <div className='w-full'>
        <Image
          src={`${prefix}/img/dev/gabriel/ss-maple.png`}
          width={1289}
          height={896}
          layout={'intrinsic'}
          loader={customLoader}
          unoptimized
        />
      </div>
      <small className='font-thin text-sm mx-auto'>
        Wow, it brings me many flashbacks.. I remember I made all the rounded
        corners with CSS background images.
      </small>
      <p>
        It's not <span className='text-secondary'>THAT BAD</span> but, can you
        see all the signs of a bad design here?{' '}
      </p>
      <p>
        There are many blocks and colors attracting your focus, you don't know
        what to do first. So confusing at first sight, right?
      </p>
      <p>
        What I needed was just a method to dose the quantity of colors, and what
        I found more than 10 years later was the 60-30-10 proportion.
      </p>
      <p>
        It means that a portion of 60% of your design should have one color or a
        shade of this color, another portion of 30% a secondary one and the 10%
        remaining another one.
      </p>
      <p>
        And I don't need to mention that the AIA Composition can use this same
        proportion for their sizes, right?
      </p>
      <p>Have a look on a good 60-30-10 proportion applied.</p>
      <div className='w-full'>
        <Image
          src={`${prefix}/img/dev/gabriel/ss-twitter.png`}
          width={1258}
          height={711}
          layout={'intrinsic'}
          loader={customLoader}
          unoptimized
        />
      </div>
      <p>
        You first look at the big element on the left, then your eyes slide to
        the right where the middle and the small sized elements lie.
      </p>
      <p>
        60% blue, 30% white and 10% gray. Attract, Intrigue and call to an
        Action.
      </p>
      <p>It's like magic. At least for programmers.</p>
      <p>
        And It's important for you to know that these numbers aren't an absolute
        rule.{' '}
      </p>
      <p>
        You can and should use more than 3 colors but you have to distribute
        that in a clean and clear way in order to be effective.
      </p>
      <p>
        So find a way to balance the 60-30-10 proportion yourself. It will make
        your design really better.
      </p>
      <h3 className='font-futura text-2xl md:text-4xl pt-4 md:pt-10'>
        <span className='text-primary'>3</span> Life Principles We Can Apply To
        UI/UX
      </h3>
      <p>
        Communication and design are all related to UI/UX and the better they
        are the better will be the results.
      </p>
      <p>
        Now, how can we assimilate life principles to it and apply it to UI/UX?
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-primary'>1/3</span> Everything Constantly Changes
      </h3>
      <p>
        The World keeps changing and progressing while other things will
        inevitably become obsolete, especially in the field of technology.
      </p>
      <p>
        In my experience, I think I spent too much time working with PHP, and I
        missed when Javascript was arising.
      </p>
      <p>
        But it's not something I regret, it's just a fact that things kept
        changing. And it will keep changing.
      </p>
      <p>
        That is why I believe that user interfaces should be improved every time
        it isn't working or when it could be better.
      </p>
      <p>
        And we will never know better ways if we don't make tests, validations
        and upgrades frequently.
      </p>
      <p>
        So only the end-users will be really impacted by the differences between
        changes we've made, and that's why we should always be listening to
        them.
      </p>
      <p>
        We have to keep it in mind. End-users satisfaction will change, new
        processes will be included, and new roles will always surge.
      </p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-primary'>2/3</span> Simplicity is Key
      </h3>
      <p>
        You might be thinking: "You are being too obvious, everybody knows that
        simplicity on Design is some kind of a rule."
      </p>
      <p>But let's take this to a deeper level. </p>
      <p>
        Whatever your business is, it must have a simple purpose and this
        purpose should be achievable within a few clicks.
      </p>
      <p>
        Let's look at an example from a famous Riding App that everyone probably
        knows:{' '}
      </p>
      <div className='w-full'>
        <Image
          src={`${prefix}/img/dev/gabriel/ss-uber.png`}
          width={1218}
          height={646}
          layout={'intrinsic'}
          loader={customLoader}
          unoptimized
        />
      </div>
      <p>
        Their purpose is clearly expressed. They want to connect private drivers
        and passengers to a mutual help system, creating a new kind of
        decentralized economic system.
      </p>
      <p>
        And it can be easily achievable just by opening the app on a smartphone
        and by choosing where you want to go.{' '}
      </p>
      <p>Within a few clicks, the purpose is achieved.</p>
      <p>
        But you know that in the middle of these entire process there is a lot
        of complex things going on.
      </p>
      <p>
        And just the simple output from a complex background will help both
        driver and passenger.
      </p>
      <p>Because for end-users, only the output is what really matters.</p>
      <p>And it's our job to simplify things for them.</p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-primary'>3/3</span> What should we give to our
        users?
      </h3>
      <p>
        From 2016 until 2018, when I lived in Brazil, it was the time when I
        invested in courses on personal development.
      </p>
      <p>
        One of them was a course on <b>Dave Elman's Method of Hypnosis</b>.
      </p>
      <p>
        And In this field, it is not always that you can help someone that is in
        a trance state.
      </p>
      <p>
        I mean, you can help someone getting into a trance state by following
        the protocol, but it isn't always that you will be capable of helping
        them precisely with their emotional problems.
      </p>
      <p>
        And when it happens, the instructors taught us to give the subject (or
        the patient) something they called the{' '}
        <b className='text-primary capitalize'>hypnotic gift</b>.
      </p>
      <p>
        It consisted of giving the subject positive suggestions and making them
        feel good emotions before they emerge from the trance state.
      </p>
      <p>
        So that at least that session could result in a positive outcome, which
        is more valuable than if we did nothing.
      </p>
      <p>In the UI/UX Universe I believe that we can do something similar.</p>
      <p>
        Sometimes we will need to make small changes or big ones, or sometimes
        we will need to do everything from zero.
      </p>
      <p>
        It doesn't matter what but those big or small changes, or the system's
        new design should be a gift for both the current users and the new ones.
      </p>
      <p>Or, at least, let them know that its intentions are all positive.</p>
      <p>
        This whole page experience is my gift for you that kept with me until
        here.
      </p>
      <p>I hope you enjoyed these contents and use it wisely.</p>
      <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
        <span className='text-primary'></span> Why I wrote this content?
      </h3>
      <p>
        As you might have seen on my profile section, at the moment, I have low
        business level in Japanese and English languages. My main is Portuguese.
      </p>
      <p>
        Since I came to live in Tokyo in January 2022, I needed to practice my
        English and Japanese skills in order to make a better personal marketing
        in this country.
      </p>
      <p>Then I had this idea of practicing Copywriting as well.</p>
      <p>
        Then I thought that this content would be interesting for my future
        teams to know.
      </p>
      <p>
        Then, I'm here asking you to share this page with anyone who might be
        interested in having me on a team.
      </p>
      <p>Or to anyone who you think might be benefited from this content.</p>
      <p>
        I'm not an authority in communication or design, I'm only someone trying
        to share experiences and thoughts.
      </p>
      <p>So use all this information as advices and not absolute truths.</p>
      <p className='flex text-primary justify-center space-x-4 text-sm mt-18'>
        <span>Let's connect</span>
        <span>Share this page</span>
        <span>Buy me a Coffee</span>
      </p>
    </section>
  )
}

export default Introduction
