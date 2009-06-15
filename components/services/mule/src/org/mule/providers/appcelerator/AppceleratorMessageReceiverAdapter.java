package org.mule.providers.appcelerator;

import org.appcelerator.messaging.Message;
import org.appcelerator.service.ServiceAdapter;

import java.util.ArrayList;
import java.util.List;

public class AppceleratorMessageReceiverAdapter extends ServiceAdapter {

    private AppceleratorMessageReceiver receiver;
    
    public AppceleratorMessageReceiverAdapter(String request, String response, String version, AppceleratorMessageReceiver receiver) {
        this.request = request;
        this.response = response;
        this.version = version;
        this.receiver = receiver;
    }

    public void dispatch(Message request, Message response) {
        this.dispatch(request, response, new ArrayList<Message>(), null);
    }

    @Override
    public Object dispatch(Message request, Message response, List<Message> additionalMessages, Object retval) {
        receiver.dispatch(request, response);
        return null;
    }

    @Override
    public boolean is(ServiceAdapter sa) {
        // TODO Auto-generated method stub
        return false;
    }

}
