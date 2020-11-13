package base.fragments

import android.annotation.SuppressLint
import android.os.Handler
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.ekino.onekeysdk.R
import java.util.*
import kotlin.collections.ArrayList

class FragmentState(private val fragmentManager: FragmentManager, idContent: Int) : IFragmentState {
    private var idContent = R.id.fragmentContainer
    private var stackSelected = -1
    private var tagCount: Int = 0
    private val stacksFragment: ArrayList<Stack<IFragment>>
    private var rootFragments: ArrayList<IFragment>? = null
    private val fragmentsKeepAlive: MutableList<String>
    private var crrView = ""
    private var enableAnim = true
    private var inAnim: Int? = 0
    private var outAnim: Int? = 0
    private var isChanging = false
    private val handler by lazy { Handler() }
    private val runnable by lazy {
        Runnable {
            isChanging = false
        }
    }

    init {
        this.idContent = idContent
        stacksFragment = ArrayList()
        fragmentsKeepAlive = ArrayList()
    }

    override fun setStacksRootFragment(fragments: ArrayList<IFragment>) {
        for (ignored in fragments) {
            stacksFragment.add(Stack())
        }
        rootFragments = fragments
    }

    override fun getRootFragments(): ArrayList<IFragment>? {
        return rootFragments
    }

    override fun changeRootFragment(fragments: IFragment, stackId: Int) {
        executeFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                clearStack(stackId, fragmentTransaction)
                if (stacksFragment[stackId].size > 0) {
                    fragmentTransaction.remove(stacksFragment[stackId].pop())
                }
                rootFragments!![stackId] = fragments
                refreshStack(stackId, fragmentTransaction)
            }
        })
    }

    override val isRootFragment: Boolean
        get() {
            return stacksFragment[stackSelected].size <= 1
        }

    override fun isFragmentsAdded(): Boolean {
        return rootFragments?.isNotEmpty() == true
    }

    override fun pushFragment(iPrevChangeFragAction: IPrevChangeFragAction?, fragment: IFragment) {
        if (isChanging) return
        isChanging = true
        if (!checkFragDuplicate(fragment)) {
            executePrevChangeFragAction(iPrevChangeFragAction)
            executeFragTransaction(null, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    pushFrag(fragment, fragmentTransaction)
                }
            })
        }
    }

    override fun pushFragment(iPrevChangeFragAction: IPrevChangeFragAction, fragment: IFragment,
                              ignoreDuplicate: Boolean) {
        if (isChanging) return
        isChanging = true
        executePrevChangeFragAction(iPrevChangeFragAction)
        if (ignoreDuplicate) {
            executeFragTransaction(null, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    pushFrag(fragment, fragmentTransaction)
                }
            })
        } else {
            pushFragment(null, fragment)
        }
    }

    override fun pushFragmentKeepOld(iPrevChangeFragAction: IPrevChangeFragAction?, fragment: IFragment) {
        if (!checkFragDuplicate(fragment)) {
            executePrevChangeFragAction(iPrevChangeFragAction)
            executeFragTransaction(null, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    pushFragKeepOld(fragment, fragmentTransaction)
                }
            })
        }
    }

    override fun pushFragmentKeepOld(iPrevChangeFragAction: IPrevChangeFragAction?, fragment: IFragment,
                                     ignoreDuplicate: Boolean) {
        if (isChanging) return
        isChanging = true
        executePrevChangeFragAction(iPrevChangeFragAction)
        if (ignoreDuplicate) {
            executeFragTransaction(null, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    pushFragKeepOld(fragment, fragmentTransaction)
                }
            })
        } else {
            pushFragmentKeepOld(null, fragment)
        }
    }

    private fun delayAnim() {
        if (enableAnim) {
            handler.postDelayed(runnable, 200)
        }
    }

    override fun popFragment(numberPop: Int) {
        crrView = ""
        if (numberPop >= stacksFragment[stackSelected].size) {
            throw StringIndexOutOfBoundsException("Number pop out of stack size")
        }
        executePopFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                for (index in 0 until numberPop) {
                    fragmentsKeepAlive.remove(stacksFragment[stackSelected].peek().tag)
                    fragmentTransaction.remove(stacksFragment[stackSelected].pop())
                }
                if (!fragmentsKeepAlive.contains(stacksFragment[stackSelected].peek().tag)) {
                    fragmentTransaction.attach(stacksFragment[stackSelected].peek())
                } else {
                    fragmentTransaction.show(stacksFragment[stackSelected].peek())
                    fragmentsKeepAlive.remove(stacksFragment[stackSelected].peek().tag)
                }
            }
        })
    }

    override fun popFragment(index: Int, numberPop: Int) {
        crrView = ""
        if (numberPop >= stacksFragment[index].size) {
            throw StringIndexOutOfBoundsException("Number pop out of stack size")
        }
        executePopFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                for (index in 0 until numberPop) {
                    fragmentsKeepAlive.remove(stacksFragment[index].peek().tag)
                    fragmentTransaction.remove(stacksFragment[index].pop())
                }
            }
        })
    }

    override fun showStack(stackId: Int) {
        if (stackId != stackSelected) {
            executeFragTransaction(null, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    attachStack(stackId, fragmentTransaction)
                    detachPrevStack(fragmentTransaction)
                    stackSelected = stackId
                }
            })
        }
    }

    override fun refreshStack(stackId: Int) {
        refreshStack(stackId, null)
    }

    override fun replaceFragment(iPrevChangeFragAction: IPrevChangeFragAction, fragment: IFragment) {
        executePrevChangeFragAction(iPrevChangeFragAction)
        executeFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                fragmentTransaction.replace(idContent, fragment, generateTag(fragment))
            }
        })
        stacksFragment[stackSelected].pop()
        stacksFragment[stackSelected].push(fragment)
    }

    override fun clearStack(stackId: Int) {
        executeFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                clearStack(stackId, fragmentTransaction)
            }
        })
    }

    override fun clearAllStacks() {
        executeFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                for (stack in stacksFragment) {
                    clearStack(stacksFragment.indexOf(stack), fragmentTransaction)
                }
            }
        })
    }

    override fun getFragByTag(tag: String): Fragment {
        return fragmentManager.findFragmentByTag(tag)!!
    }

    override fun getFragmentManager(): FragmentManager {
        return this.fragmentManager
    }

    override fun setCustomAnimation(inAnim: Int, outAnim: Int) {
        this.inAnim = inAnim
        this.outAnim = outAnim
    }

    override fun enableAnim(enable: Boolean) {
        enableAnim = enable
    }

    override fun resetAnimation() {
        inAnim = null
        outAnim = null
    }

    @SuppressLint("CommitTransaction")
    override fun beginTrans(): FragmentTransaction {
        return if (enableAnim) {
            fragmentManager.beginTransaction().setCustomAnimations(inAnim!!, R.anim.exit_right_to_left)
//            fragmentManager.beginTransaction().setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
        } else {
            fragmentManager.beginTransaction()
        }
    }

    private fun popTrans(): FragmentTransaction = if (enableAnim) {
        fragmentManager.beginTransaction().setCustomAnimations(0, outAnim!!)
    } else {
        fragmentManager.beginTransaction()
    }

    private fun executeFragTransaction(fragmentTransactionPending: FragmentTransaction?, executeAction: IExecuteAction) {
        val fragmentTransaction = fragmentTransactionPending ?: beginTrans()
        executeAction.execute(fragmentTransaction)
        if (fragmentTransactionPending == null) {
            fragmentTransaction.commitAllowingStateLoss()
        }
    }

    private fun executePopFragTransaction(fragmentTransactionPending: FragmentTransaction?, executeAction: IExecuteAction) {
        val fragmentTransaction = fragmentTransactionPending ?: popTrans()
        executeAction.execute(fragmentTransaction)
        if (fragmentTransactionPending == null) {
            fragmentTransaction.commitAllowingStateLoss()
        }
    }

    private fun checkFragDuplicate(fragment: IFragment): Boolean {
        return crrView == fragment.javaClass.simpleName
    }

    private fun pushFrag(fragment: IFragment, fragmentTransaction: FragmentTransaction) {
        fragmentTransaction.add(idContent, fragment, generateTag(fragment))
        detachCurrentFrag(fragmentTransaction)
        stacksFragment[stackSelected].push(fragment)
        crrView = fragment.javaClass.simpleName
        delayAnim()
    }

    private fun pushFragKeepOld(fragment: IFragment, fragmentTransaction: FragmentTransaction) {
        fragmentTransaction.hide(stacksFragment[stackSelected].peek()).add(idContent, fragment, generateTag(fragment))
        stacksFragment[stackSelected].peek().tag?.let { fragmentsKeepAlive.add(it) }
        stacksFragment[stackSelected].push(fragment)
        crrView = fragment.javaClass.simpleName
        delayAnim()
    }

    private fun generateTag(fragment: IFragment): String {
        return fragment.javaClass.name + '_' + ++tagCount
    }

    private fun attachStack(stackId: Int, fragmentTransaction: FragmentTransaction) {
        if (stacksFragment[stackId].size == 0) {
            initStack(stackId, fragmentTransaction)
        } else {
            fragmentTransaction.attach(stacksFragment[stackId].peek())
        }
    }

    private fun detachPrevStack(fragmentTransaction: FragmentTransaction) {
        if (stackSelected != -1) {
            detachCurrentFrag(fragmentTransaction)
        }
    }

    private fun detachCurrentFrag(fragmentTransaction: FragmentTransaction) {
        fragmentTransaction.detach(stacksFragment[stackSelected].peek())
    }

    private fun initStack(stackId: Int, fragmentTransaction: FragmentTransaction) {
        stacksFragment[stackId].push(rootFragments!![stackId])
        fragmentTransaction.add(
                idContent,
                stacksFragment[stackId].peek(),
                generateTag(stacksFragment[stackId].peek()))
    }

    private fun refreshStack(stackId: Int, fragmentTransactionPending: FragmentTransaction?) {
        if (stackId == stackSelected) {
            executeFragTransaction(fragmentTransactionPending, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    attachStack(stackId, fragmentTransaction)
                }
            })
        }
    }

    private fun clearStack(stackId: Int, fragmentTransactionPending: FragmentTransaction) {
        val stackFragment = stacksFragment[stackId]
        while (stackFragment.size > 1) {
            executeFragTransaction(fragmentTransactionPending, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    fragmentTransaction.remove(stackFragment.pop())
                }
            })
        }
        refreshStack(stackId, fragmentTransactionPending)
    }

    override fun clearAllOfStack(stackId: Int) {
        executeFragTransaction(null, object : IExecuteAction {
            override fun execute(fragmentTransaction: FragmentTransaction) {
                clearAllOfStack(stackId, fragmentTransaction)
            }
        })
    }

    private fun clearAllOfStack(stackId: Int, fragmentTransactionPending: FragmentTransaction) {
        val stackFragment = stacksFragment[stackId]
        while (stackFragment.size > 1) {
            executeFragTransaction(fragmentTransactionPending, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    fragmentTransaction.remove(stackFragment.pop())
                }
            })
        }
        if (stackId == stackSelected) {
            executeFragTransaction(fragmentTransactionPending, object : IExecuteAction {
                override fun execute(fragmentTransaction: FragmentTransaction) {
                    attachStack(stackId, fragmentTransaction)
                    if (stacksFragment[stackId].size == 0) {
                        initStack(stackId, fragmentTransaction)
                    } else {
                        fragmentTransaction.show(stacksFragment[stackId].peek())
                    }
                }
            })
        }

    }

    private fun executePrevChangeFragAction(iPrevChangeFragAction: IPrevChangeFragAction?) {
        iPrevChangeFragAction?.execute()
    }

    override val stacks: ArrayList<Stack<IFragment>>
        get() {
            return stacksFragment
        }

    override fun currentStack() = stackSelected

    override fun clearHandler() {
        handler.removeCallbacks(runnable)
    }
}
